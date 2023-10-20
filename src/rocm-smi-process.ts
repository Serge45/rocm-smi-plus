import { spawnSync } from "child_process";
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

        return spawnSync(`${this.rocmSmiPath} -a --json`).stdout.toJSON();
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

        cards.forEach((v: string, i: number) => {
            const cardIdx: CardIdx = v as CardIdx; 
            const usage: number = Number.parseInt(output[cardIdx][gpuUsageStr]);
            const ramUsage: number = Number.parseInt(output[cardIdx][ramUsageStr]);
            infos.push(new GpuCardInfo(usage, ramUsage));
        });

        return infos;
    }
};

export class MockRocmSmiProcess extends RocmSmiProcess {
    public run(): object | null {
        return JSON.parse('{"card0": {"GPU ID": "0x740f", "Unique ID": "0x33d8808f71bf6cd4", "VBIOS version": "113-D67301-059", "Temperature (Sensor edge) (C)": "35.0", "Temperature (Sensor junction) (C)": "35.0", "Temperature (Sensor memory) (C)": "44.0", "Temperature (Sensor HBM 0) (C)": "44.0", "Temperature (Sensor HBM 1) (C)": "41.0", "Temperature (Sensor HBM 2) (C)": "42.0", "Temperature (Sensor HBM 3) (C)": "43.0", "fclk clock speed:": "(400Mhz)", "fclk clock level:": "0", "mclk clock speed:": "(1600Mhz)", "mclk clock level:": "3", "sclk clock speed:": "(800Mhz)", "sclk clock level:": "1", "socclk clock speed:": "(1090Mhz)", "socclk clock level:": "3", "Performance Level": "auto", "GPU OverDrive value (%)": "0", "GPU Memory OverDrive value (%)": "0", "Max Graphics Package Power (W)": "300.0", "Average Graphics Package Power (W)": "40.0", "GPU use (%)": "0", "GFX Activity": "136106754", "GPU memory use (%)": "0", "Memory Activity": "8476118", "GPU memory vendor": "hynix", "PCIe Replay Count": "0", "Serial Number": "692224000227", "Voltage (mV)": "793", "PCI Bus": "0000:03:00.0", "ASD firmware version": "0x00000000", "CE firmware version": "0", "DMCU firmware version": "0", "MC firmware version": "0", "ME firmware version": "0", "MEC firmware version": "71", "MEC2 firmware version": "71", "PFP firmware version": "0", "RLC firmware version": "17", "RLC SRLC firmware version": "0", "RLC SRLG firmware version": "0", "RLC SRLS firmware version": "0", "SDMA firmware version": "8", "SDMA2 firmware version": "8", "SMC firmware version": "00.68.59.00", "SOS firmware version": "0x0027007f", "TA RAS firmware version": "27.00.01.60", "TA XGMI firmware version": "32.00.00.13", "UVD firmware version": "0x00000000", "VCE firmware version": "0x00000000", "VCN firmware version": "0x0110101b", "Card series": "Instinct MI210", "Card model": "0x0c34", "Card vendor": "Advanced Micro Devices, Inc. [AMD/ATI]", "Card SKU": "D67301", "Valid sclk range": "500Mhz - 1700Mhz", "Valid mclk range": "400Mhz - 1600Mhz", "Voltage point 0": "0Mhz 0mV", "Voltage point 1": "0Mhz 0mV", "Voltage point 2": "0Mhz 0mV", "Energy counter": "6709332050409", "Accumulated Energy (uJ)": "102652781650961.23"}, "card1": {"GPU ID": "0x740f", "Unique ID": "0x888f6513544df63a", "VBIOS version": "113-D67301-059", "Temperature (Sensor edge) (C)": "29.0", "Temperature (Sensor junction) (C)": "32.0", "Temperature (Sensor memory) (C)": "45.0", "Temperature (Sensor HBM 0) (C)": "45.0", "Temperature (Sensor HBM 1) (C)": "44.0", "Temperature (Sensor HBM 2) (C)": "43.0", "Temperature (Sensor HBM 3) (C)": "43.0", "fclk clock speed:": "(400Mhz)", "fclk clock level:": "0", "mclk clock speed:": "(1600Mhz)", "mclk clock level:": "3", "sclk clock speed:": "(800Mhz)", "sclk clock level:": "1", "socclk clock speed:": "(1090Mhz)", "socclk clock level:": "3", "Performance Level": "auto", "GPU OverDrive value (%)": "0", "GPU Memory OverDrive value (%)": "0", "Max Graphics Package Power (W)": "300.0", "Average Graphics Package Power (W)": "40.0", "GPU use (%)": "0", "GFX Activity": "655193", "GPU memory use (%)": "0", "Memory Activity": "90", "GPU memory vendor": "hynix", "PCIe Replay Count": "0", "Serial Number": "888f6513544df63a", "Voltage (mV)": "793", "PCI Bus": "0000:43:00.0", "ASD firmware version": "0x00000000", "CE firmware version": "0", "DMCU firmware version": "0", "MC firmware version": "0", "ME firmware version": "0", "MEC firmware version": "71", "MEC2 firmware version": "71", "PFP firmware version": "0", "RLC firmware version": "17", "RLC SRLC firmware version": "0", "RLC SRLG firmware version": "0", "RLC SRLS firmware version": "0", "SDMA firmware version": "8", "SDMA2 firmware version": "8", "SMC firmware version": "00.68.59.00", "SOS firmware version": "0x0027007f", "TA RAS firmware version": "27.00.01.60", "TA XGMI firmware version": "32.00.00.13", "UVD firmware version": "0x00000000", "VCE firmware version": "0x00000000", "VCN firmware version": "0x0110101b", "Card series": "Aldebaran", "Card model": "0x0c34", "Card vendor": "Advanced Micro Devices, Inc. [AMD/ATI]", "Card SKU": "D67301", "Valid sclk range": "500Mhz - 1700Mhz", "Valid mclk range": "400Mhz - 1600Mhz", "Voltage point 0": "0Mhz 0mV", "Voltage point 1": "0Mhz 0mV", "Voltage point 2": "0Mhz 0mV", "Energy counter": "6751909746646", "Accumulated Energy (uJ)": "103304220411508.38"}, "card2": {"GPU ID": "0x740f", "Unique ID": "0x1e22c59d5a95b0ed", "VBIOS version": "113-D67301-059", "Temperature (Sensor edge) (C)": "33.0", "Temperature (Sensor junction) (C)": "34.0", "Temperature (Sensor memory) (C)": "45.0", "Temperature (Sensor HBM 0) (C)": "44.0", "Temperature (Sensor HBM 1) (C)": "43.0", "Temperature (Sensor HBM 2) (C)": "41.0", "Temperature (Sensor HBM 3) (C)": "45.0", "fclk clock speed:": "(400Mhz)", "fclk clock level:": "0", "mclk clock speed:": "(1600Mhz)", "mclk clock level:": "3", "sclk clock speed:": "(800Mhz)", "sclk clock level:": "1", "socclk clock speed:": "(1090Mhz)", "socclk clock level:": "3", "Performance Level": "auto", "GPU OverDrive value (%)": "0", "GPU Memory OverDrive value (%)": "0", "Max Graphics Package Power (W)": "300.0", "Average Graphics Package Power (W)": "40.0", "GPU use (%)": "0", "GFX Activity": "573651", "GPU memory use (%)": "0", "Memory Activity": "0", "GPU memory vendor": "hynix", "PCIe Replay Count": "0", "Serial Number": "1e22c59d5a95b0ed", "Voltage (mV)": "793", "PCI Bus": "0000:83:00.0", "ASD firmware version": "0x00000000", "CE firmware version": "0", "DMCU firmware version": "0", "MC firmware version": "0", "ME firmware version": "0", "MEC firmware version": "71", "MEC2 firmware version": "71", "PFP firmware version": "0", "RLC firmware version": "17", "RLC SRLC firmware version": "0", "RLC SRLG firmware version": "0", "RLC SRLS firmware version": "0", "SDMA firmware version": "8", "SDMA2 firmware version": "8", "SMC firmware version": "00.68.59.00", "SOS firmware version": "0x0027007f", "TA RAS firmware version": "27.00.01.60", "TA XGMI firmware version": "32.00.00.13", "UVD firmware version": "0x00000000", "VCE firmware version": "0x00000000", "VCN firmware version": "0x0110101b", "Card series": "Aldebaran", "Card model": "0x0c34", "Card vendor": "Advanced Micro Devices, Inc. [AMD/ATI]", "Card SKU": "D67301", "Valid sclk range": "500Mhz - 1700Mhz", "Valid mclk range": "400Mhz - 1600Mhz", "Voltage point 0": "0Mhz 0mV", "Voltage point 1": "0Mhz 0mV", "Voltage point 2": "0Mhz 0mV", "Energy counter": "6741238586769", "Accumulated Energy (uJ)": "103140951663354.92"}, "card3": {"GPU ID": "0x740f", "Unique ID": "0x36e1f2ad03c7e1d2", "VBIOS version": "113-D67301-059", "Temperature (Sensor edge) (C)": "33.0", "Temperature (Sensor junction) (C)": "33.0", "Temperature (Sensor memory) (C)": "47.0", "Temperature (Sensor HBM 0) (C)": "42.0", "Temperature (Sensor HBM 1) (C)": "47.0", "Temperature (Sensor HBM 2) (C)": "44.0", "Temperature (Sensor HBM 3) (C)": "42.0", "fclk clock speed:": "(400Mhz)", "fclk clock level:": "0", "mclk clock speed:": "(1600Mhz)", "mclk clock level:": "3", "sclk clock speed:": "(800Mhz)", "sclk clock level:": "1", "socclk clock speed:": "(1090Mhz)", "socclk clock level:": "3", "Performance Level": "perf_determinism", "GPU OverDrive value (%)": "0", "GPU Memory OverDrive value (%)": "0", "Max Graphics Package Power (W)": "300.0", "Average Graphics Package Power (W)": "42.0", "GPU use (%)": "0", "GFX Activity": "290078824", "GPU memory use (%)": "0", "Memory Activity": "147562085", "GPU memory vendor": "hynix", "PCIe Replay Count": "0", "Serial Number": "692224000294", "Voltage (mV)": "843", "PCI Bus": "0000:A3:00.0", "ASD firmware version": "0x00000000", "CE firmware version": "0", "DMCU firmware version": "0", "MC firmware version": "0", "ME firmware version": "0", "MEC firmware version": "71", "MEC2 firmware version": "71", "PFP firmware version": "0", "RLC firmware version": "17", "RLC SRLC firmware version": "0", "RLC SRLG firmware version": "0", "RLC SRLS firmware version": "0", "SDMA firmware version": "8", "SDMA2 firmware version": "8", "SMC firmware version": "00.68.59.00", "SOS firmware version": "0x0027007f", "TA RAS firmware version": "27.00.01.60", "TA XGMI firmware version": "32.00.00.13", "UVD firmware version": "0x00000000", "VCE firmware version": "0x00000000", "VCN firmware version": "0x0110101b", "Card series": "Instinct MI210", "Card model": "0x0c34", "Card vendor": "Advanced Micro Devices, Inc. [AMD/ATI]", "Card SKU": "D67301", "Valid sclk range": "500Mhz - 1502Mhz", "Valid mclk range": "400Mhz - 1600Mhz", "Voltage point 0": "0Mhz 0mV", "Voltage point 1": "0Mhz 0mV", "Voltage point 2": "0Mhz 0mV", "Energy counter": "7108635344472", "Accumulated Energy (uJ)": "108762122126286.19"}, "system": {"Driver version": "5.18.13", "PID1905652": "rocfft_offline_, 0, 0, 0, 0"}}');
    }
}
