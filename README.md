# attentionSpeedTask
This repository contains the components for a computer-based **Speed of Attention** cognitive assessment, developed using [Tatool Web](www.tatool-web.com) (von Bastian, Locher & Ruflin, 2013). The task was designed by **Dr Alon Zivony** and coded by **Eleanor Hyde**, with thanks to **Prof Claudia von Bastian**.

## Description
Each trial begins with the presentation of a fixation cross for 500 ms, followed by a rapid serial visual presentation (RSVP) stream of up to 14 letters and numbers. Each item appears for 50 ms with an inter-stimulus interval of 50 ms. One digit (1–9) in the stream is surrounded by a circle, marking it as the target. After the stream, a blank screen is shown for 200 ms, followed by a question mark prompting the participant to respond by pressing the number key corresponding to the target digit.

Practice Phase:
- 2 slowed-down practice trials (1000 ms per item)
- 2 normal-speed practice trials (50 ms per item
  
Experimental Phase:
- 60 test trials (50 ms per item)
The task takes approximately **5 minutes** to complete.

## Contents
- `Executables/` – task configuration files for Tatool
- `Instructions/` – instruction pages displayed to participants
- `Modules/` – grouped task components used to execute the experiment in a sequence, including instructions, countdowns, practice trials and experimental trials
- `Stimuli/` – digit and letter stimuli, fixation cross, recognition question mark, and associated `.csv` files
