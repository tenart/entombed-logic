
# Entombed Maze Logic Builder
A drag-and-drop Scratch-like logic builder. Easily customize how the maze is generated. This project has several main classes: the **Editor**, **Draggable**, and **LogicOperator**, each implemented in their respective JS file.

| Classes | Description |
|-|-|
| **Editor** | The main simulation engine. |
| **Draggable** | The default implementation for all draggable objects to share. Will spawn a generic item for testing when no arguments are provided. |
| **LogicOperator** | A logic operator object that can be dragged around and snapped together to construct logic statements. This class extends **Draggable**.  |

## Editor Class
  This class is the main simulation engine of this project. It has a reference to all objects created through it. Create a new Editor instance with `const editor = new Editor()`. This **constructor requires no parameters** to instantiate.

| Primary Methods | Description |
|-|-|
| `Editor.createObject()` | Create a new object and add it to this editor's collection. |
| `Editor.removeObject()` | Remove an object from the editor's collection. |
| `Editor.attachLogicOperators()` | Attach two logic operators together. |
| `Editor.detachLogicOperators()` | Detach two logic operators. |
