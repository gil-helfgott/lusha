import {exec, execSync} from "child_process";
import {mongoContainerName, redisContainerName} from "./envUp";

execSync(`docker stop ${mongoContainerName} || true && docker rm ${mongoContainerName} || true`);
execSync(`docker stop ${redisContainerName} || true && docker rm ${redisContainerName} || true`);
