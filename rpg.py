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


def status_screen(player):
    # Display character sheet/status
    print("\n===== Character Status =====")
    print(f"Name: {player['name']}")
    print(f"Level: {player['level']}")
    print(f"HP: {player['hp']}/{player['max_hp']}")
    print(f"Attack: {player['attack']}")
    print(f"Defense: {player['defense']}")
    print(f"Experience: {player['exp']}")
    print("Inventory:", ', '.join(item['name'] for item in player['inventory']) if player['inventory'] else 'Empty')
    print("Equipped Weapon:", player['equipment'].get('weapon', 'None'))
    print("Equipped Armor:", player['equipment'].get('armor', 'None'))
    print("============================\n")


def use_item(player):
    # Use items from inventory
    if not player['inventory']:
        print("No items to use.")
        return
    print("Items:")
    for idx, item in enumerate(player['inventory'], 1):
        print(f"{idx}. {item['name']}")
    choice = input("Choose item number to use: ")
    if not choice.isdigit() or int(choice) < 1 or int(choice) > len(player['inventory']):
        print("Invalid choice.")
        return
    item = player['inventory'].pop(int(choice) - 1)
    if item['type'] == 'heal':
        heal_amount = item['value']
        player['hp'] += heal_amount
        if player['hp'] > player['max_hp']:
            player['hp'] = player['max_hp']
        print(f"You used {item['name']} and recovered {heal_amount} HP!")
    # Could add other item types


def equip_item(player):
    # Equip weapons or armor from inventory
    equippable = [item for item in player['inventory'] if item['type'] in ('weapon','armor')]
    if not equippable:
        print("No equippable items.")
        return
    print("Equippable Items:")
    for idx, item in enumerate(equippable, 1):
        print(f"{idx}. {item['name']}")
    choice = input("Choose item number to equip: ")
    if not choice.isdigit() or int(choice) < 1 or int(choice) > len(equippable):
        print("Invalid choice.")
        return
    item = equippable[int(choice) - 1]
    # Remove from inventory
    player['inventory'].remove(item)
    if item['type'] == 'weapon':
        player['equipment']['weapon'] = item['name']
        player['attack'] += item['value']
        print(f"You equipped {item['name']}! Attack increased.")
    elif item['type'] == 'armor':
        player['equipment']['armor'] = item['name']
        player['defense'] += item['value']
        print(f"You equipped {item['name']}! Defense increased.")


def level_up(player):
    # Check if player levels up
    level_threshold = 100
    while player['exp'] >= level_threshold:
        player['exp'] -= level_threshold
        player['level'] += 1
        player['max_hp'] += 20
        player['attack'] += 2
        player['defense'] += 1
        player['hp'] = player['max_hp']
        print(f"Congratulations! You reached level {player['level']}!")
        level_threshold += 50


def start_game():
    # Initialize player data
    player = {
        'name': input("Enter your character name: "),
        'level': 1,
        'hp': 100,
        'max_hp': 100,
        'attack': 10,
        'defense': 5,
        'heal': 10,
        'exp': 0,
        'inventory': [
            {'name': 'Potion', 'type': 'heal', 'value': 30},
            {'name': 'Sword', 'type': 'weapon', 'value': 5},
            {'name': 'Shield', 'type': 'armor', 'value': 3},
        ],
        'equipment': {}
    }

    print(f"Welcome, {player['name']}! Your adventure begins...")

    # Scenario and enemies
    enemies = [
        {'name': 'Goblin', 'hp': 30, 'attack': 5, 'defense': 1, 'exp': 30},
        {'name': 'Orc', 'hp': 60, 'attack': 8, 'defense': 2, 'exp': 50},
        {'name': 'Dragon', 'hp': 150, 'attack': 15, 'defense': 5, 'exp': 150, 'boss': True},
    ]

    # Opening narrative
    print("In a land of adventure, you set out on a quest to defeat the evil rising in the north.")
    print("You will face monsters and grow stronger with each victory.")

    # Travel map (simple representation)
    show_map()

    for enemy in enemies:
        print(f"\nA wild {enemy['name']} appears! It has {enemy['hp']} HP.")
        battle(player, enemy)
        if player['hp'] <= 0:
            print("You have been defeated... Game Over!")
            return
        player['exp'] += enemy['exp']
        level_up(player)

    print("\nCongratulations! You defeated the final boss and completed the adventure.")


def show_map():
    # Simple map representation using ASCII
    print("\n===== Map =====")
    print("[Start] -- Forest -- Cave -- Castle (Boss)")
    print("================")


def display_battle_scene(player, enemy):
    # Display a simple battle scene reminiscent of classic RPGs
    print("\n===== Battle Scene =====")
    print(f"{player['name']:<10}    vs    {enemy['name']}")
    # ASCII characters representing characters
    print("   O            O")
    print("  /|\\          /|\\")
    print("  / \\          / \\")
    print(f"{player['hp']} HP         {enemy['hp']} HP")
    print("========================")


def battle(player, enemy):
    enemy_hp = enemy['hp']
    while enemy_hp > 0 and player['hp'] > 0:
        display_battle_scene(player, {'name': enemy['name'], 'hp': enemy_hp})

        print("\nChoose an action:")
        print("1. Attack")
        print("2. Use Item")
        print("3. Status")
        print("4. Equip Item")
        action = input("Enter your choice: ")

        if action == '1':
            damage = max(0, player['attack'] + random.randint(-2, 2) - enemy['defense'])
            enemy_hp -= damage
            print(f"You attack {enemy['name']} for {damage} damage!")
        elif action == '2':
            use_item(player)
        elif action == '3':
            status_screen(player)
        elif action == '4':
            equip_item(player)
        else:
            print("Invalid choice! You lose your turn.")

        # Enemy turn if still alive
        if enemy_hp > 0:
            enemy_damage = max(0, enemy['attack'] + random.randint(-1, 3) - player['defense'])
            player['hp'] -= enemy_damage
            print(f"{enemy['name']} attacks you for {enemy_damage} damage!")

    if enemy_hp <= 0:
        print(f"You defeated the {enemy['name']}!")
    else:
        print("You have been defeated in battle...")


if __name__ == '__main__':
    title_screen()
