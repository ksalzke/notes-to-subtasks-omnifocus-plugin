(() => {
  var functionLibrary = new PlugIn.Library(new Version("1.0"));

  functionLibrary.noteToSubtasks = function (task) {
    // *******CONFIGURATION******* //
    // The name of the tag that subtasks are tagged with
    // THIS SHOULD BE A STRING
    checklistTagName = "✓";

    // The tags that shouldn't be inherited by the subtasks
    // THIS SHOULD BE AN ARRAY OF TAG OBJECTS
    uninheritedTags = [];

    // If you are not me, you can safely delete the following section (or tweak it to match your own setup)
    if (PlugIn.find("com.KaitlinSalzke.config") !== null) {
      uninheritedTags = PlugIn.find("com.KaitlinSalzke.config")
        .library("configLibrary")
        .uninheritedTags();
    }
    // *************************** //

    // get current perspective
    var startingPerspective = document.windows[0].perspective;

    // ignore everything up to first '[ ]' or '- ' or '_'' in TaskPaper
    var regex = /^.*?(?=_*\[\s\]|_*-\s)/gs;
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
      // return to starting perspective
      console.log(startingPerspective);
      if (startingPerspective === Perspective.BuiltIn.Projects) {
        taskId = task.id.primaryKey;
        taskUrlStr = "omnifocus:///task/" + taskId;
        URL.fromString(taskUrlStr).call(() => {});
      } else if (startingPerspective instanceof Perspective.BuiltIn) {
        document.windows[0].perspective = startingPerspective;
      } else {
        var perspectiveUrlStr =
          "omnifocus:///perspective/" +
          encodeURIComponent(startingPerspective.name);
        URL.fromString(perspectiveUrlStr).call(() => {});
      }
    });
  };

  return functionLibrary;
})();
