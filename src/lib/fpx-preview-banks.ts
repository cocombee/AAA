// Retail FPX preview labels checked against PayNet's public bank guidance.
// Corporate-only and staging/test banks are omitted. IDs only preserve local
// preview selection; a connected checkout must use its provider's live IDs.
// https://paynet.my/personal-solutions/fpx.html
export const fpxPreviewBanks = [
  { id: "ABB0233", label: "Affin Bank" },
  { id: "ABMB0212", label: "Alliance Bank (Personal)" },
  { id: "AGRO01", label: "AGRONet" },
  { id: "AMBB0209", label: "AmBank" },
  { id: "BCBB0235", label: "CIMB Clicks" },
  { id: "BIMB0340", label: "Bank Islam" },
  { id: "BKRM0602", label: "Bank Rakyat" },
  { id: "BMMB0341", label: "Bank Muamalat" },
  { id: "BOCM01", label: "Bank of China" },
  { id: "BSN0601", label: "BSN" },
  { id: "HLB0224", label: "Hong Leong Bank" },
  { id: "HSBC0223", label: "HSBC Bank" },
  { id: "KFH0346", label: "KFH" },
  { id: "MB2U0227", label: "Maybank2U" },
  { id: "maybank2e-preview", label: "Maybank2E" },
  { id: "MBSB001", label: "MBSB Bank" },
  { id: "OCBC0229", label: "OCBC Bank" },
  { id: "PBB0233", label: "Public Bank" },
  { id: "RHB0218", label: "RHB Bank" },
  { id: "SCB0216", label: "Standard Chartered" },
  { id: "UOB0226", label: "UOB Bank" },
] as const;
