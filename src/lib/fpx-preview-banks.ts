// Retail FPX preview labels checked against PayNet's public bank guidance.
// Corporate-only and staging/test banks are omitted. IDs only preserve local
// preview selection; a connected checkout must use its provider's live IDs.
// https://paynet.my/personal-solutions/fpx.html
export const fpxPreviewBanks = [
  { id: "ABB0233", label: "Affin Bank", logo: 'affin' },
  { id: "ABMB0212", label: "Alliance Bank (Personal)", logo: 'alliance' },
  { id: "AGRO01", label: "AGRONet", logo: 'agro' },
  { id: "AMBB0209", label: "AmBank", logo: 'ambank' },
  { id: "BCBB0235", label: "CIMB Clicks", logo: 'cimb' },
  { id: "BIMB0340", label: "Bank Islam", logo: 'bank-islam' },
  { id: "BKRM0602", label: "Bank Rakyat", logo: 'bank-rakyat' },
  { id: "BMMB0341", label: "Bank Muamalat", logo: 'bank-muamalat' },
  { id: "BOCM01", label: "Bank of China", logo: 'bank-of-china' },
  { id: "BSN0601", label: "BSN", logo: 'bsn' },
  { id: "HLB0224", label: "Hong Leong Bank", logo: 'hong-leong' },
  { id: "HSBC0223", label: "HSBC Bank", logo: 'hsbc' },
  { id: "KFH0346", label: "KFH", logo: null },
  { id: "MB2U0227", label: "Maybank2U", logo: 'maybank' },
  { id: "maybank2e-preview", label: "Maybank2E", logo: 'maybank' },
  { id: "MBSB001", label: "MBSB Bank", logo: 'mbsb' },
  { id: "OCBC0229", label: "OCBC Bank", logo: 'ocbc' },
  { id: "PBB0233", label: "Public Bank", logo: 'public-bank' },
  { id: "RHB0218", label: "RHB Bank", logo: 'rhb' },
  { id: "SCB0216", label: "Standard Chartered", logo: 'standard-chartered' },
  { id: "UOB0226", label: "UOB Bank", logo: 'uob' },
] as const;
