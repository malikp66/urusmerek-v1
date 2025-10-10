export type BankOption = {
  code: string;
  name: string;
};

export const INDONESIAN_BANKS: BankOption[] = [
  { code: 'BCA', name: 'Bank Central Asia (BCA)' },
  { code: 'MANDIRI', name: 'Bank Mandiri' },
  { code: 'BNI', name: 'Bank Negara Indonesia (BNI)' },
  { code: 'BRI', name: 'Bank Rakyat Indonesia (BRI)' },
  { code: 'CIMB', name: 'Bank CIMB Niaga' },
  { code: 'DANAMON', name: 'Bank Danamon' },
  { code: 'PANIN', name: 'Bank Panin' },
  { code: 'PERMATA', name: 'Bank Permata' },
  { code: 'BTN', name: 'Bank Tabungan Negara (BTN)' },
  { code: 'OCBC', name: 'Bank OCBC NISP' },
  { code: 'BTPN', name: 'Bank BTPN' },
  { code: 'MUAMALAT', name: 'Bank Muamalat' },
  { code: 'BSI', name: 'Bank Syariah Indonesia (BSI)' },
  { code: 'MEGA', name: 'Bank Mega' },
  { code: 'MAYBANK', name: 'Maybank Indonesia' },
  { code: 'SINARMAS', name: 'Bank Sinarmas' },
  { code: 'WOORI', name: 'Bank Woori Saudara' },
  { code: 'COMMONWEALTH', name: 'Commonwealth Bank' },
];

export function findBankByCode(code: string | null | undefined): BankOption | undefined {
  if (!code) return undefined;
  return INDONESIAN_BANKS.find((bank) => bank.code === code);
}
