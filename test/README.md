# Setting up test Repos

Two directories are required, each being a copy of a cloned repository (provided by you--BYOR). The directories are named mario and luigi.

To get started, run the following in your faviorite or 2nd favorite shell from `gitnotice/test/repos`:

```shell
$ rmdir mario && rmdir luigi
$ git clone https://git-repo.git mario
$ git clone https://git-repo.git luigi
```

Then, from `gitnotice/test`:

```shell
$ sh setup-test-users
$ sh setup-gitnotice-dev
```

You are then ready to run automated simple workflows for testing the notice-hook! Any changes made to `gitnotice/post-merge` will automatically be used in this test environment if it was setup with the above steps.
