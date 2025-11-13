import random

def title_screen():
    print("Welcome to Simple RPG!")
    print("1. Start Game")
    print("2. Quit")
    choice = input("Enter your choice: ")
    if choice == '1':
        start_game()
    else:
        print("Thanks for playing!")

def start_game():
    player = {'name': '', 'hp': 100, 'attack': 10, 'heal': 10}
    enemies = [
        {'name': 'Goblin', 'hp': 30, 'attack': 5},
        {'name': 'Orc', 'hp': 50, 'attack': 8},
        {'name': 'Dragon', 'hp': 100, 'attack': 15}
    ]

    player['name'] = input("Enter your character name: ")
    print(f"Welcome, {player['name']}! Your adventure begins...")

    for enemy in enemies:
        print(f"\nA wild {enemy['name']} appears! It has {enemy['hp']} HP.")
        battle(player, enemy)
        if player['hp'] <= 0:
            print("You have been defeated... Game Over!")
            return

    print("\nCongratulations! You defeated all enemies and completed the adventure.")

def battle(player, enemy):
    while enemy['hp'] > 0 and player['hp'] > 0:
        print(f"\n{player['name']} HP: {player['hp']} | {enemy['name']} HP: {enemy['hp']}")
        print("Choose an action:")
        print("1. Attack")
        print("2. Heal")
        action = input("Enter your choice: ")

        if action == '1':
            damage = player['attack'] + random.randint(-2, 2)
            enemy['hp'] -= damage
            print(f"You attack {enemy['name']} for {damage} damage!")
        elif action == '2':
            heal_amount = player['heal'] + random.randint(-5, 5)
            player['hp'] += heal_amount
            if player['hp'] > 100:
                player['hp'] = 100
            print(f"You heal yourself for {heal_amount} HP.")
        else:
            print("Invalid choice! You lose your turn.")

        if enemy['hp'] > 0:
            enemy_damage = enemy['attack'] + random.randint(-1, 3)
            player['hp'] -= enemy_damage
            print(f"{enemy['name']} attacks you for {enemy_damage} damage!")

    if enemy['hp'] <= 0:
        print(f"You defeated the {enemy['name']}!")
    else:
        print("You have been defeated in battle...")

if __name__ == '__main__':
    title_screen()
