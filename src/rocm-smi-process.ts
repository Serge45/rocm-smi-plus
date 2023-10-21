import { execFileSync } from "child_process";
import { randomInt } from "crypto";
import * as fs from 'fs';

class GpuCardInfo {
    constructor(public gpuUsage: number,
        public ramUsage: number) {}
}

export class RocmSmiProcess {
    constructor(public readonly rocmSmiPath: string) {}
    public exists(): boolean {
        return fs.existsSync(this.rocmSmiPath);
    }

    public run(): object | null {
        if (!this.exists()) {
            return null;
        }

        const output = execFileSync(this.rocmSmiPath, ["-a", "--json"]);
        return JSON.parse(output.toString('utf-8'));
    }

    public runFormated(): Array<GpuCardInfo> | null {
        const output = this.run();

        if (!output) {
            return output;
        }

        let cards = Object.keys(output).filter((v) => { return v !== "system"; });
        let infos: GpuCardInfo[] = [];
        type CardIdx = keyof typeof output;
        type GpuUsage = keyof typeof output;
        type RamUsage = keyof typeof output;
        const gpuUsageStr = "GPU use (%)" as GpuUsage;
        const ramUsageStr = "GPU memory use (%)" as RamUsage;
        console.log(`Total ${cards.length} cards`);

        cards.forEach((v: string) => {
            const cardIdx: CardIdx = v as CardIdx; 
            console.log(output[cardIdx]);
            const usage: number = Number.parseInt(output[cardIdx][gpuUsageStr]);
            const ramUsage: number = Number.parseInt(output[cardIdx][ramUsageStr]);
            infos.push(new GpuCardInfo(usage, ramUsage));
        });

        return infos;
    }
};

export class MockRocmSmiProcess extends RocmSmiProcess {
    private makeMockObject(): any {
        let mockObject =
        {
            "card0": {
                "GPU use (%)": randomInt(100),
                "GPU memory use (%)": randomInt(100)
            },
            "card1": {
                "GPU use (%)": randomInt(100),
                "GPU memory use (%)": randomInt(100)
            }
        };

        return mockObject;
    }

    public run(): any {
        return this.makeMockObject();
    }
}
