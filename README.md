# Overview

This tool calculates AT LEAST some number of successes in some number of independent bernoulli trials.
Imagine flipping a coin 5 times and asking the chance of getting heads at least twice. Is it 60%? 70%? Well this can tell you.

I have wanted to make these sorts of little tools to visualize probabilities in different ways for a long time, and have also wanted to learn typescript. I figured it was a good fit as I'm doing a lot of work behind the scenes, passing data between methods and such.


[Software Demo Video](https://youtu.be/hNGru58qX3M)

# Development Environment

This was made with visual studio code. I used to live server extension to test the webpage.

I made this using typescript. Typescript compiles into javascript using a console command, so the webpage never actually sees the .ts file.

# Useful Websites

- [Typescript Manual](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Bernoulli trial - Wikipedia](https://en.wikipedia.org/wiki/Bernoulli_trial)

# Future Work

There are a lot of things I hope to improve about this later-

- Use an approximation to support more than 20 trials
- Allow hovering over the graph to see values
- More graphs to visualize the data in different ways, like instead of putting the number of trials on the x axis put the number of successes needed, etc.