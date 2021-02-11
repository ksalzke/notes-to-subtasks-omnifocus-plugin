(() => {
  var functionLibrary = new PlugIn.Library(new Version("1.0"));

  functionLibrary.noteToSubtasks = function (task) {
    // configuration
    config = PlugIn.find("com.KaitlinSalzke.noteToSubtasks").library(
      "noteToSubtasksConfig"
    );
    checklistTagName = config.checklistTagName();
    uninheritedTags = config.uninheritedTags();

    // stop if no TaskPaper found
    regex = /^.*?(?=_*\[\s\]|_*-\s)/gs;
    if (!regex.test(task.note)) {
      return;
    }

    // get current perspective
    var startingPerspective = document.windows[0].perspective;

    // if task is a repeating task, duplicate and drop before expanding the new task
    nTask = duplicateTasks([task], task.before)[0];
    nTask.repetitionRule = null;
    task.drop(false);
    task = nTask;

    // ignore everything up to first '[ ]' or '- ' or '_'' in TaskPaper
    var taskpaper = task.note.replace(regex, "");

    // get note and replace underscores before "[" with tabs -- needed because Shortcut removes tabs from Drafts template
    taskpaper = taskpaper.replace(/(_)+(?=\[)/g, function (match) {
      let underscoreLength = match.length;
      let replacement = "\t".repeat(underscoreLength);
      return replacement;
    });

    // replace '[ ]' with '-'
    taskpaper = taskpaper.replace(/\[\s\]/g, " - ");

    //create list of tags from original task
    var tagArray = [];
    task.tags.forEach(function (tag) {
      if (!uninheritedTags.includes(tag)) {
        tagArray.push(tag.name);
      }
    });
    tagList = tagArray.join(", ");

    // add parent & checklist tags (where there are existing tags on line in taskpaper)
    taskpaper = taskpaper.replace(
      /@tags\((.+)\)/gm,
      `@tags($1, ${checklistTagName}, ${tagList})`
    );

    // add parent & checklist tags (where there aren't any exsting tags on line in taskpaper)
    taskpaper = taskpaper.replace(
      /(^((?!@tags).)*$)/gm,
      `$1 @tags(${checklistTagName},${tagList})`
    );

    // replace '( )' with '[ ]'
    taskpaper = taskpaper.replace(/\(\s\)/g, "[ ]");

    // replace '< >' with '( )'
    taskpaper = taskpaper.replace(/\<\s\>/g, "( )");

    // build URL to paste tasks
    var pasteUrlStr =
      "omnifocus:///paste?target=/task/" +
      encodeURIComponent(task.id.primaryKey) +
      "&content=" +
      encodeURIComponent(taskpaper);

    //open URL (generating subtasks)
    URL.fromString(pasteUrlStr).call(() => {
      // check if there is only one subtask now and if so expand it too
      if (task.children.length == 1) {
        this.noteToSubtasks(task.children[0]);
      }

      // return to starting perspective
      if (Perspective.BuiltIn.all.includes(startingPerspective)) {
        document.windows[0].perspective = startingPerspective;
      } else {
        document.windows[0].perspective = Perspective.Custom.byName(startingPerspective.name);
      }


    });
  };

  return functionLibrary;
})();
