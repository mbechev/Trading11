export class OpenOrderDTO {
    id: string;
    symbol: string;
    market: string;
    opendate: Date;
    openPrice: number;
    units: number;
    direction: string;
    sellPrice: number;
    buyPrice: number;
    company: {
        abbr,
        name
    };
}
