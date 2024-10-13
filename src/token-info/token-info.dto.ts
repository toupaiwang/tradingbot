export class TokenInfoDto {
  success: boolean;
  message: string;
  result: TokenResultDto;
}

export class TokenResultDto {
  name: string;
  symbol: string;
  metadata_uri: string;
  description: string;
  image: string;
  decimals: number;
  address: string;
  mint_authority: string;
  freeze_authority: string;
  current_supply: number;
  extensions: any[]; // 如果有明确的扩展结构，可以进一步定义类型
}
