
# Deserted Island Adventure
# story maker about being stranded on an Island

name = input("what is your name") # string

items = input("you can bring three items, what will you bring?") # string

days = input("how many days have you been stranded?") # integer

temperature = input("what is the temperature on the island?") # float

foodFound = input("have you found any food yet? (yes/no)") == "yes" # boolean

# beginning of the story is built using the inputs (concatenation)
story = name + " became stranded on a deserted island for " + days + " days. The temperature was " + temperature + " degrees and the only items they had were a " + items + "."

print(story)
