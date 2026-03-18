#!/usr/bin/env python3
"""
VOICEVOXでテキストを読み上げてWAVファイルを生成するスクリプト。

使い方:
  # VOICEVOX起動 (Docker)
  docker run -d --name voicevox -p 50021:50021 voicevox/voicevox_engine:cpu-ubuntu20.04-latest

  # 単一テキスト
  python3 scripts/voicevox-generate.py "こんにちは" --output public/voiceover/hello.wav

  # シーンJSONから一括生成
  python3 scripts/voicevox-generate.py --scenes scripts/scenes.json

可愛い女の子キャラ（デフォルト: ずんだもん speaker_id=3）
  --speaker 3   ずんだもん（あまあま）
  --speaker 0   四国めたん（あまあま）
  --speaker 2   四国めたん（ツンツン）
  --speaker 22  小夜/SAYO
  --speaker 8   春日部つむぎ
"""

import argparse
import json
import os
import struct
import sys
import urllib.request
import urllib.parse


VOICEVOX_URL = "http://localhost:50021"


def audio_query(text: str, speaker: int) -> dict:
    params = urllib.parse.urlencode({"text": text, "speaker": speaker})
    url = f"{VOICEVOX_URL}/audio_query?{params}"
    req = urllib.request.Request(url, method="POST")
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read())


def synthesis(query: dict, speaker: int) -> bytes:
    params = urllib.parse.urlencode({"speaker": speaker})
    url = f"{VOICEVOX_URL}/synthesis?{params}"
    data = json.dumps(query).encode("utf-8")
    req = urllib.request.Request(url, data=data, method="POST",
                                 headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req) as resp:
        return resp.read()


def generate_one(text: str, speaker: int, output: str, speed: float = 1.0, pitch: float = 0.0):
    print(f"  音声合成中: \"{text}\" (speaker={speaker})")
    query = audio_query(text, speaker)
    query["speedScale"] = speed
    query["pitchScale"] = pitch
    wav_data = synthesis(query, speaker)
    os.makedirs(os.path.dirname(output) or ".", exist_ok=True)
    with open(output, "wb") as f:
        f.write(wav_data)
    print(f"  保存: {output} ({len(wav_data)} bytes)")
    return wav_data


def get_wav_duration_ms(wav_data: bytes) -> int:
    """WAVバイナリからミリ秒の長さを取得"""
    if len(wav_data) < 44:
        return 0
    sample_rate = struct.unpack_from("<I", wav_data, 24)[0]
    byte_rate = struct.unpack_from("<I", wav_data, 28)[0]
    data_size = struct.unpack_from("<I", wav_data, 40)[0]
    if byte_rate == 0:
        return 0
    return int((data_size / byte_rate) * 1000)


def generate_captions_from_scenes(scenes: list, speaker: int, speed: float, pitch: float):
    """シーン情報から音声+キャプションJSONを一括生成"""
    captions = []
    current_ms = 0
    gap_ms = 300  # シーン間のギャップ

    for i, scene in enumerate(scenes):
        text = scene["text"]
        output_path = scene.get("output", f"public/voiceover/scene_{i:03d}.wav")

        wav_data = generate_one(text, speaker, output_path, speed, pitch)
        duration_ms = get_wav_duration_ms(wav_data)

        # テキストを文字単位でキャプションに分割（日本語対応）
        words = split_japanese_text(text)
        word_duration = duration_ms / max(len(words), 1)

        for j, word in enumerate(words):
            start = current_ms + int(j * word_duration)
            end = current_ms + int((j + 1) * word_duration)
            captions.append({
                "text": word,
                "startMs": start,
                "endMs": end,
                "timestampMs": start,
                "confidence": 0.95,
            })

        current_ms += duration_ms + gap_ms

    return captions


def split_japanese_text(text: str) -> list:
    """日本語テキストを意味のある単位で分割（簡易版）"""
    import re
    # 助詞・助動詞の後、句読点の後で区切る
    parts = re.split(r'([\u3001\u3002\uff01\uff1f!?,.\s]+)', text)
    result = []
    for part in parts:
        if not part.strip():
            if result:
                result[-1] += part
            continue
        # 長い部分は3-5文字ずつに分割
        if len(part) > 5:
            for k in range(0, len(part), 4):
                chunk = part[k:k+4]
                if chunk:
                    result.append(chunk)
        else:
            result.append(part)
    return result if result else [text]


def main():
    parser = argparse.ArgumentParser(description="VOICEVOX 音声生成")
    parser.add_argument("text", nargs="?", help="読み上げテキスト（単一）")
    parser.add_argument("--speaker", type=int, default=3,
                        help="話者ID (default: 3=ずんだもん あまあま)")
    parser.add_argument("--speed", type=float, default=1.1, help="話速 (default: 1.1)")
    parser.add_argument("--pitch", type=float, default=0.05, help="ピッチ (default: 0.05)")
    parser.add_argument("--output", default="public/voiceover/output.wav", help="出力WAVファイル")
    parser.add_argument("--scenes", help="シーンJSONファイル (一括生成)")
    parser.add_argument("--captions-output", default="public/captions.json",
                        help="キャプション出力先 (default: public/captions.json)")
    args = parser.parse_args()

    if args.scenes:
        with open(args.scenes, encoding="utf-8") as f:
            scenes = json.load(f)
        print(f"{len(scenes)} シーンの音声を生成します...")
        captions = generate_captions_from_scenes(scenes, args.speaker, args.speed, args.pitch)
        with open(args.captions_output, "w", encoding="utf-8") as f:
            json.dump(captions, f, ensure_ascii=False, indent=2)
        print(f"\nキャプション保存: {args.captions_output} ({len(captions)} エントリ)")
        print("完了！")
    elif args.text:
        generate_one(args.text, args.speaker, args.output, args.speed, args.pitch)
        print("完了！")
    else:
        parser.print_help()
        sys.exit(1)


if __name__ == "__main__":
    main()
