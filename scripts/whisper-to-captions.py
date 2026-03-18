#!/usr/bin/env python3
"""
Whisperの文字起こし結果を @remotion/captions の Caption型JSONに変換するスクリプト。

使い方:
  python3 scripts/whisper-to-captions.py <audio_file> [--model large-v3] [--language ja] [--output public/captions.json]

前提:
  pip install openai-whisper
"""

import argparse
import json
import sys


def transcribe_and_convert(audio_path: str, model_name: str, language: str, output_path: str):
    try:
        import whisper
    except ImportError:
        print("Error: openai-whisper がインストールされていません。")
        print("  pip install openai-whisper")
        sys.exit(1)

    print(f"モデル '{model_name}' を読み込み中...")
    model = whisper.load_model(model_name)

    print(f"'{audio_path}' を文字起こし中...")
    result = model.transcribe(audio_path, language=language, word_timestamps=True)

    captions = []
    for segment in result["segments"]:
        for word_info in segment.get("words", []):
            start_ms = int(word_info["start"] * 1000)
            end_ms = int(word_info["end"] * 1000)
            captions.append({
                "text": word_info["word"],
                "startMs": start_ms,
                "endMs": end_ms,
                "timestampMs": start_ms,
                "confidence": round(word_info.get("probability", 0.95), 3),
            })

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(captions, f, ensure_ascii=False, indent=2)

    print(f"完了！ {len(captions)} 単語を '{output_path}' に保存しました。")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Whisper → Remotion Caption JSON 変換")
    parser.add_argument("audio", help="音声ファイルのパス")
    parser.add_argument("--model", default="large-v3", help="Whisperモデル名 (default: large-v3)")
    parser.add_argument("--language", default="ja", help="言語コード (default: ja)")
    parser.add_argument("--output", default="public/captions.json", help="出力先 (default: public/captions.json)")
    args = parser.parse_args()

    transcribe_and_convert(args.audio, args.model, args.language, args.output)
