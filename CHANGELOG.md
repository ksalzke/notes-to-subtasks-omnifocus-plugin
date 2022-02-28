## [5.4.1](https://github.com/ksalzke/notes-to-subtasks-omnifocus-plugin/compare/v5.4.0...v5.4.1) (2022-02-28)


### Bug Fixes

* :bug: fix bug re extra dropped and done tasks being added to the checklist task ([db324a1](https://github.com/ksalzke/notes-to-subtasks-omnifocus-plugin/commit/db324a17c04b8d9d6935d723ae69bb976503fd63))
* :bug: fix issues with tags being deleted after being set in prefs ([1f067af](https://github.com/ksalzke/notes-to-subtasks-omnifocus-plugin/commit/1f067aff0bd3fa21ac959935a5d5e1c4ec3c8860)), closes [#10](https://github.com/ksalzke/notes-to-subtasks-omnifocus-plugin/issues/10)



# [5.4.0](https://github.com/ksalzke/notes-to-subtasks-omnifocus-plugin/compare/v5.3.0...v5.4.0) (2022-02-19)


### Features

* :lipstick: rename 'Preferences' to 'Preferences: Note To Subtasks' ([734790e](https://github.com/ksalzke/notes-to-subtasks-omnifocus-plugin/commit/734790ea524cb6ac42616a08ea2151789028c9b7))
* :sparkles: update validation: now always available ([c73d7cc](https://github.com/ksalzke/notes-to-subtasks-omnifocus-plugin/commit/c73d7cc2ee0b0c034797df049d1ee80630d3e301))



# [5.3.0](https://github.com/ksalzke/notes-to-subtasks-omnifocus-plugin/compare/v5.2.0...v5.3.0) (2021-12-02)


### Bug Fixes

* autocomplete parent task where a template is used ([aed5a7c](https://github.com/ksalzke/notes-to-subtasks-omnifocus-plugin/commit/aed5a7cbfcfffe7bd183f36a55c48672ca04b4cb))


### Features

* add optional 'expandable' tag ([f431618](https://github.com/ksalzke/notes-to-subtasks-omnifocus-plugin/commit/f431618a944ef73165ba1259061b4c94f885c10b)), closes [#6](https://github.com/ksalzke/notes-to-subtasks-omnifocus-plugin/issues/6)
* make 'Preferences' always available on macOS ([de11586](https://github.com/ksalzke/notes-to-subtasks-omnifocus-plugin/commit/de115865a9b356797466451d79486e3dd317d576))



# [5.2.0](https://github.com/ksalzke/notes-to-subtasks-omnifocus-plugin/compare/v5.1.1...v5.2.0) (2021-12-02)


### Features

* restructure for easier installation/release ([a91e611](https://github.com/ksalzke/notes-to-subtasks-omnifocus-plugin/commit/a91e611bf3f8d026a6f4c72edc819bc4bb5e9c79))



## [5.1.1](https://github.com/ksalzke/notes-to-subtasks-omnifocus-plugin/compare/v5.1.0...v5.1.1) (2021-11-12)


### Bug Fixes

* inherit parent tags when creating from template ([1e3b5ff](https://github.com/ksalzke/notes-to-subtasks-omnifocus-plugin/commit/1e3b5ff6a8bb378cff9a1b533a85fa088924b178))



# [5.1.0](https://github.com/ksalzke/notes-to-subtasks-omnifocus-plugin/compare/v5.0.0...v5.1.0) (2021-11-11)


### Features

* add 'tags to remove from skipped task when expanding' preference ([8fcd21a](https://github.com/ksalzke/notes-to-subtasks-omnifocus-plugin/commit/8fcd21a37ed8934456be3f97a5f9898f034e23e2))



# [5.0.0](https://github.com/ksalzke/notes-to-subtasks-omnifocus-plugin/compare/v4.1.0...v5.0.0) (2021-11-11)


### Bug Fixes

* fix bug where uninherited tags were not removed ([97bcd1d](https://github.com/ksalzke/notes-to-subtasks-omnifocus-plugin/commit/97bcd1d3f9be28579f0577c1065d06d7a95ec850))


### Code Refactoring

* remove config library no longer used ([51b3a72](https://github.com/ksalzke/notes-to-subtasks-omnifocus-plugin/commit/51b3a72974c0a4e5c6d7ab199941badec4b71b9b))


### Features

* add 'Preferences' action and 'checklist tag' preference ([5240390](https://github.com/ksalzke/notes-to-subtasks-omnifocus-plugin/commit/52403908426943216f511917a93e81e1cae2c3ef))
* add 'Uninherited Tags' preference ([e487cbc](https://github.com/ksalzke/notes-to-subtasks-omnifocus-plugin/commit/e487cbcfec6fad2110c23396c118b2b1e8fb8027))


### BREAKING CHANGES

* Preferences are now stored in SyncedPref object, rather than in a configuration library.
SyncedPreferences plugin is required to be installed.



# [4.1.0](https://github.com/ksalzke/notes-to-subtasks-omnifocus-plugin/compare/v4.0.0...v4.1.0) (2021-11-08)


### Features

* add SF symbols ([982b630](https://github.com/ksalzke/notes-to-subtasks-omnifocus-plugin/commit/982b630e639f742b88a167efff65d2fbcfc1fabb))



# [4.0.0](https://github.com/ksalzke/notes-to-subtasks-omnifocus-plugin/compare/303b158677044b59b8527bfa86276c1e6afccb8c...v4.0.0) (2021-11-08)


### Bug Fixes

* update to reflect changes in Templates plugin ([303b158](https://github.com/ksalzke/notes-to-subtasks-omnifocus-plugin/commit/303b158677044b59b8527bfa86276c1e6afccb8c))


### BREAKING CHANGES

* templateToSubtasks function is now asynchronous



