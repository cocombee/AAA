import { Homepage } from "@/components/home/homepage";
import { previewEnabled } from "@/lib/supabase/config";
export default function Page() { return <Homepage loginHref={previewEnabled() ? "/flow/member-26-akaun-utama" : "/login"} />; }
