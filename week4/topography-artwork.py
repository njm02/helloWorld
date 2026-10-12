
import turtle
import math
import random

pen = turtle.Turtle()
pen.speed(0)

screen = turtle.Screen()
screen.setup(width=0.9, height=0.85)
screen.setworldcoordinates(-550, -425, 550, 425)

screen.bgcolor("#081426")
pen.pencolor("white")
screen.tracer(10, 0)
phase = random.uniform(0, 2 * math.pi)

def draw_hill(center_x, center_y):
    phase = random.uniform(0, 2 * math.pi)

    for contour_number, base_radius in enumerate(range(10, 1201, 10)):
        
        fade = min(base_radius / 650, 1)

        red = 0.95 * (1 - fade) + 0.08 * fade
        green = 0.97 * (1 - fade) + 0.15 * fade
        blue = 1.0 * (1 - fade) + 0.25 * fade

        pen.pencolor(red, green, blue)


        if contour_number % 5 == 0:
            pen.pensize(1.5)
        else:
            pen.pensize(1)
    
        pen.penup()

        for angle in range(361):
            radians = math.radians(angle)

            wave_strength = base_radius / 80

            radius = base_radius + wave_strength * (
                12 * math.sin(3 * radians)
                + 7 * math.sin(5 * radians + phase)
                + 4 * math.cos(2 * radians)
            )

            twist = base_radius * 0.002

            x = center_x + 1.4 * radius * math.cos(radians + twist)
            y = center_y + 0.8 * radius * math.sin(radians + twist)

            pen.goto(x, y)
            pen.pendown()


draw_hill(-250,150)

screen.update()
pen.hideturtle()
turtle.done()

