1. Running `ng` fails with error: `execution of scripts is disabled on this system`. and only works with `ng.cmd`
> Fix: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`