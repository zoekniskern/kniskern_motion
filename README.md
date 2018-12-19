# kniskern_motion
Using motion detection as a variable seed for visual generation

https://zoekniskern.github.io/kniskern_motion/

The motion tracking is forked from code written by Ben Horn. By using variables of the div that tracks motion, the shader responds to changes on the webcam. When there is little motion, the shader is yellow and the waves are very calm. In comparison, when there is a large amount of motion, the shader is very active and blue. This visual correlation between the two sides is subtle yet intriguing.

I started out with a completely different idea before I settled on this one. I also wanted to make use of the x and y coordinates of the motion tracking div which did not end up working. Overall, the actual reaction that is evident between the motion tracking and the shader meets a bare minimum goal for proof of concept.