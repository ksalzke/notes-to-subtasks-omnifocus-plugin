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



