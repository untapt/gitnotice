# Gitnotice - add messaging to your version control

Leave important announcements for your developers when they need them.

Notices are left in commits, and alerts a developer when changes are first pulled in.

```shell
nick@local ~/project $ git commit -m 'breaking changes #notice update secrets to include REDIS_PASSWORD'

[master 0e30d2c] breaking changes #notice update secrets to include REDIS_PASSWORD
 1 file changed, 1 insertion(+)

nick@local ~/project $ git push origin master

Writing objects: 100% (3/3), 327 bytes | 327.00 KiB/s, done.
Total 3 (delta 2), reused 0 (delta 0)
To my-test-repo.git
   2de8884..0e30d2c  master -> master

```

```shell
ben@local ~/project $ git pull origin master

remote: Counting objects: 3, done.
remote: Compressing objects: 100% (3/3), done.
remote: Total 3 (delta 2), reused 0 (delta 0)
Unpacking objects: 100% (3/3), done.
From my-test-repo 
 * branch            master     -> FETCH_HEAD
   0e30d2c..702244d  master     -> origin/master
Updating 0e30d2c..702244d
Fast-forward
 gitnotice-test.txt | 1 +
 1 file changed, 1 insertion(+)
 
*********************
::   GIT NOTICES   ::
*********************

0e30d2c Nick Palenchar: update secrets to include REDIS_PASSWORD

(END)
 
```

Ben can rest easy knowing exactly what to update since last pulling this breaking change 👍

## Setup

```shell
$ npm i -g @untapt/gitnotice
```

gitnotice's hook operates on local git repos, so each one needs to be setup manually. The gitnotice CLI (installed via npm) automates most of this.

In a repo you wish to add gitnotice

```
~/myproject $ gitnotice init
> gitnotice initialized (0.2.1)
```

You can also automaticaly add gitnotice to every repo found under a given directory.

```
~ $ gitnotice init-all
Initialized Gitnotice in the following repositories:
✅ /home/me/myproject
✅ /home/me/myotherproject
✅ /home/me/yetanotherproject
```

## Bugs?

Feel free to [submit an issue.](#)

## Contributing

Checkout our [CONTRIBUTING](docs/CONTRIBUTING.md) doc!
