import { execFileSync } from "child_process";
import { randomInt } from "crypto";
import * as fs from 'fs';

export class GpuCardInfo {
    constructor(
        public readonly series: string,
        public readonly gpuUsage: number,
        public readonly ramUsage: number,
        public readonly sclk: number,
        public readonly mclk: number,
        public readonly socclk: number) { }
}

export class RocmSmiProcess {
    public lastGpuInfo: Array<GpuCardInfo> | null = null;
    private clkRegex = /^\(([0-9]+)(Mhz)\)$/;

    constructor(public readonly rocmSmiPath: string) { }
    public exists(): boolean {
        return fs.existsSync(this.rocmSmiPath);
    }

    public run(): object | null {
        if (!this.exists()) {
            return null;
        }

        const output = execFileSync(this.rocmSmiPath, ["-a", "--json"]);
        const outputStr = output.toString('utf-8');
        const begIdx = outputStr.indexOf('{');//naive way to find start of JSON object.
        return JSON.parse(outputStr.substring(begIdx));
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
        type SclkSpeed = keyof typeof output;
        type MclkSpeed = keyof typeof output;
        type SocclkSpeed = keyof typeof output;
        type Series = keyof typeof output;
        const gpuUsageStr = "GPU use (%)" as GpuUsage;
        const ramUsageStr = "GPU memory use (%)" as RamUsage;
        const sclkStr = "sclk clock speed:" as SclkSpeed;
        const mclkStr = "mclk clock speed:" as MclkSpeed;
        const socclkStr = "socclk clock speed:" as SocclkSpeed;
        const seriesStr = "Card series" as Series;

        cards.forEach((v: string) => {
            const cardIdx: CardIdx = v as CardIdx;
            const usage: number = Number.parseInt(output[cardIdx][gpuUsageStr]);
            const ramUsage: number = Number.parseInt(output[cardIdx][ramUsageStr]);
            const rawSclk: string = this.clkRegex.exec(output[cardIdx][sclkStr])?.at(1)!;
            const sclk = Number.parseInt(rawSclk);
            const rawMclk: string = this.clkRegex.exec(output[cardIdx][mclkStr])?.at(1)!;
            const mclk = Number.parseInt(rawMclk);
            const rawSocclk: string = this.clkRegex.exec(output[cardIdx][socclkStr])?.at(1)!;
            const socclk = Number.parseInt(rawSocclk);
            const series = output[cardIdx][seriesStr];
            infos.push(new GpuCardInfo(series, usage, ramUsage, sclk, mclk, socclk));
        });

        this.lastGpuInfo = infos;
        return infos;
    }
};

export class MockRocmSmiProcess extends RocmSmiProcess {
    private makeMockObject(): any {
        let mockObject =
        {
            "card0": {
                "GPU use (%)": randomInt(100),
                "GPU memory use (%)": randomInt(100),
                "sclk clock speed:": `(${randomInt(1000)}Mhz)`,
                "mclk clock speed:": `(${randomInt(1000)}Mhz)`,
                "socclk clock speed:": `(${randomInt(1000)}Mhz)`,
                "Card series": "Mock GPU"
            },
            "card1": {
                "GPU use (%)": randomInt(100),
                "GPU memory use (%)": randomInt(100),
                "sclk clock speed:": `(${randomInt(1000)}Mhz)`,
                "mclk clock speed:": `(${randomInt(1000)}Mhz)`,
                "socclk clock speed:": `(${randomInt(1000)}Mhz)`,
                "Card series": "Mock GPU"
            }
        };

        return mockObject;
    }

    public run(): any {
        return this.makeMockObject();
    }
}
