/* global PlugIn */
(() => {
  const action = new PlugIn.Action(function (selection, sender) {
    const functionLibrary = this.noteToSubtasksLib
    functionLibrary.noteToSubtasks(selection.tasks[0])
  })

  action.validate = function (selection, sender) {
    return selection.tasks.length === 1
  }

  return action
})()
