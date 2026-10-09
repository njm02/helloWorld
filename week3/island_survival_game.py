

# Island Survival Game
# choose your own adventure: a shipwreck has left you stranded on a deserted island. try to survive and get rescued.

health = 100

# Inventory: items colllected during the game
hasCoconut = False
hasSpear = False 
hasFlare = False
hasSnacks = False
hasWater = False
hasRope = False

# game over function
def game_over():
    print("""
   _____          __  __ ______    ______      ________ _____  
  / ____|   /\   |  \/  |  ____|  / __ \ \    / /  ____|  __ \ 
 | |  __   /  \  | \  / | |__    | |  | \ \  / /| |__  | |__) |
 | | |_ | / /\ \ | |\/| |  __|   | |  | |\ \/ / |  __| |  _  / 
 | |__| |/ ____ \| |  | | |____  | |__| | \  /  | |____| | \ \ 
  \_____/_/    \_\_|  |_|______|  \____/   \/   |______|_|  \_|


    """)
    quit()


# game begins
print("\nWelcome to the ISLAND SURVIVAL GAME.")

print("""
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠶⢶⣶⣶⡶⠶⠶⠶⣦⣤⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠛⢷⣄⠀⠀⠈⠉⠻⣶⣄⠀⠀⠀⠀⠀⣀⣀⣤⣤⣄⣀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⣀⡀⠀⠀⠙⢷⣄⠀⠀⠀⠈⠻⣆⢀⣠⡶⠟⠋⠉⠁⠀⠉⠙⠻⢶⣤⡀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⡶⠟⠛⠋⠉⠉⠉⠉⠙⠛⠻⠾⢿⣷⡀⠀⠀⠀⢿⠟⠉⠀⠀⠀⠀⣀⣠⣤⣤⣤⣤⣭⣿⣦⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⠟⠁⢀⣀⣤⣤⣤⣤⣤⣤⣤⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⣾⣿⣯⣭⣀⣀⠀⠀⠈⠉⠻⢷⡄⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⣥⡶⠟⠋⠉⠁⠀⠀⢀⣤⡿⠛⠁⠀⠀⠀⣀⣤⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠉⠛⠻⢶⣤⣀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⢠⣿⠟⠁⠀⠀⠀⠀⠀⣠⡾⠛⠁⠀⠀⠀⠀⣀⡿⠋⠉⠉⣿⡾⠛⠻⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠛⣷⡀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⡾⠋⠀⢀⣠⣴⠶⠟⠛⠻⣧⠀⠀⢸⣏⠀⠀⠀⢘⣿⠀⠀⠘⠿⢿⣿⡟⠻⠷⠶⣦⣄⡈⢿⡀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⠋⠀⣠⡾⠛⠉⠀⠀⠀⠀⠀⣽⠿⠶⠞⢻⣦⣤⣤⡾⠿⣦⡀⠀⠀⠀⠈⠻⣦⠀⠀⠀⠉⠻⣾⣷
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡾⢁⣴⡿⠋⠀⠀⠀⠀⠀⠀⠀⣼⠏⠀⠀⠀⣿⠁⠈⠀⠀⠀⠈⠻⣦⣄⠀⠀⠀⠸⣧⠀⠀⠀⠀⢻⡗
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣾⣧⡾⠋⠀⠀⠀⠀⠀⠀⠀⠀⣼⠿⠶⠤⠴⣾⡇⠀⠀⠀⠀⠀⠀⠀⠈⠛⢷⣄⠀⠀⢻⡆⠀⠀⠀⠈⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⡟⠀⠀⠀⢀⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢷⣄⠘⣷⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣾⣅⣀⣀⣀⣼⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢿⣿⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⡏⠉⠉⠉⠉⣽⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢿⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⠇⠀⠀⠀⠀⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⠷⠶⠶⠶⠾⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡟⠀⠀⠀⠀⠀⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡇⠀⠀⠀⠀⠀⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡷⠶⠶⠶⠶⠶⢿⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⣤⣤⡴⠶⠶⠶⣿⡇⠀⠀⠀⠀⠀⠀⢻⣶⠶⠶⢦⣤⣤⣀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢀⣠⣴⠶⠟⠛⠉⠉⠀⠀⠀⠀⠀⠀⠹⣧⣄⣀⣀⣀⣀⣀⣠⣽⠇⠀⠀⠀⠀⠉⠉⠛⠻⠷⣦⣤⣀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⣠⣴⠟⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠉⠉⠉⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⠻⢶⣄⠀⠀⠀⠀
⠀⢠⡾⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢷⡄⠀⠀
⢀⣿⣁⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣿⡄⠀
⠈⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠁⠀""")

print("\nA giant storm caused your ship to wreck.")
print("\nYou wake up on the beach and realize you're stranded on a deserted island.")
print("Your health is 100.")


# where to explore 
explore = input("\nWhere do you want to explore? Beach, Shipwreck, or Jungle? ").strip().upper()

if explore == "BEACH":
    print("\nYou found a COCONUT and a SPEAR on the beach.")
    hasCoconut = True
    hasSpear = True

elif explore == "SHIPWRECK":
    print("\nYou found a FLARE and some SNACKS in the ship wreckage.")
    hasFlare = True
    hasSnacks = True

elif explore == "JUNGLE":
    print("\nYou explore the jungle and find some ROPE and fresh WATER.")
    hasRope = True
    hasWater = True


# food choice
print("\nAfter exploring for a while, you start to get very hungry.")
health = health - 20
print("Your health has dropped to", health)
input("\nPress ENTER to continue...")

print("\nYou need to find something to eat.")
print("You can search for food in the OCEAN or JUNGLE.")

if hasSnacks == True:
    print("You can also EAT the snacks you found in the shipwreck.")

elif hasCoconut == True:
    print("You can also EAT the coconut you found on the beach.")

while True:
    food_choice = input("\nWhat do you want to do? ").strip().upper()

    if "JUNGLE" in food_choice:
        print("You search through the jungle and find some coconuts to eat.")
        health = health + 10
        break

    elif "OCEAN" in food_choice and hasSpear == True:
        print("You use your spear to catch a fish.")
        print("After eating the fish, you start to feel better.")
        health = health + 10
        break

    elif "OCEAN" in food_choice and hasSpear == False:
        print("You try to catch a fish with your hands, but don't have any luck.")
        print("This leaves you even more exhausted.")
        health = health - 20
        break

    elif "EAT" in food_choice and hasSnacks == True:
        print("You eat the snacks you found in the shipwreck.")
        health = health + 10
        break

    elif "EAT" in food_choice and hasCoconut == True:
        print("You eat the coconut you found on the beach.")
        health = health + 10
        break

    elif "EAT" in food_choice:
        print("You don't have any food in your inventory.")
        print("Try searching the JUNGLE or OCEAN.")

    else:
        print("That is not a valid choice.")
        print("Choose: EAT, JUNGLE, or OCEAN")

print("Your health is now", health)
input("\nPress ENTER to continue...")


# night is approaching, shelter choice
print("\nThe sun begins to set and night is approaching.")
print("You need to find somewhere to sleep.")

while True:
    shelter_choice = input("Do you want to BUILD shelter or sleep on the BEACH? ").strip().upper()
    if "BUILD" in shelter_choice and hasRope == True:
        print("\nYou use the rope you found to build a strong shelter. You get a good night's sleep.")
        health = health + 10
        break

    elif "BUILD" in shelter_choice and hasRope == False:
        print("\nYou try to build a shelter using branches and leaves.")
        print("Without rope, the shelter falls apart during the night.")
        health = health - 20
        break
        
    elif "BEACH" in shelter_choice:
        print("\nYou decide to sleep out in the open on the beach.")
        print("The cold and uncomfortable night takes a toll on you.")
        health = health - 20
        break

    else:
        print("That is not a valid choice.")
        print("Choose: BUILD or BEACH")

if health > 100:
    health = 100

print("Your health is now", health)
input("\nPress ENTER to continue...")


# next morning, ship spotted
print("\nYou wake up the next morning and walk out toward the shore.")
print("You look out across the ocean and suddenly see a ship in the distance!")
print("\nThis could be your chance to escape the island.")


# show current health and inventory
input("\nPress ENTER to check your health and inventory...")

print("\nCURRENT HEALTH:", health)
print("\nYOUR INVENTORY:")

if hasCoconut == True:
    print("- Coconut")

if hasSpear == True:
    print("- Spear")

if hasFlare == True:
    print("- Flare")

if hasSnacks == True:
    print("- Snacks")

if hasWater == True:
    print("- Water")

if hasRope == True:
    print("- Rope")

input("\nPress ENTER to continue...")


# rescue options
print("\nYou need to get the ship's attention before it passes the island.")
print("\nYour options are:")
print("- build a signal FIRE")
print("- SWIM toward the ship")

if hasFlare == True:
    print("- use your FLARE")

while True:
    rescue_choice = input("\nWhat do you want to do? ").strip().upper()

    if "FLARE" in rescue_choice and hasFlare == True:
        print("\nYou fire the flare high into the sky.")
        print("The ship sees your flare and changes direction toward the island.")
        print("\nYOU HAVE BEEN RESCUED!")
        game_over()
    

    elif "FLARE" in rescue_choice and hasFlare == False:
        print("\nYou don't have a flare.")
        print("Choose another option.")

    elif "FIRE" in rescue_choice and health >= 50:
        print("\nYou gather wood and build a large signal fire.")
        print("Smoke rises above the island and catches the attention of the ship. The ship changes direction and heads toward you.")
        print("\nYOU HAVE BEEN RESCUED!")
        game_over()
  

    elif "FIRE" in rescue_choice and health < 50:
        print("\nYou try to gather wood for a signal fire.")
        print("You are too weak to finish building it.")
        health = health - 20
        print("Your health is now", health)

        if health <= 0:
            game_over()

    elif "SWIM" in rescue_choice and health >= 70:
        print("\nYou jump into the ocean and begin swimming toward the ship.")
        print("You make it close enough for the crew to spot you in the water. They pull you aboard.")
        print("\nYOU HAVE BEEN RESCUED!")
        game_over()

    elif "SWIM" in rescue_choice and health < 70:
        print("\nYou jump into the ocean and begin swimming toward the ship.")
        print("You are too weak to make it.")
        health = 0
        print("Your health is now", health)
        game_over()

    else:
        print("\nThat is not a valid choice.")

        if hasFlare == True:
            print("Choose: FLARE, FIRE, or SWIM.")
        else:
            print("Choose: FIRE or SWIM.")

