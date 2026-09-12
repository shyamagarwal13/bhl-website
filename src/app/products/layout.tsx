import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

/* One chrome for all three product pages. The nav and footer are identical to the home
   page on purpose: a product page that arrives with different furniture reads as a
   different site, which is exactly the impression a comparison shopper should not get. */
export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main>{children}</main>
      <Footer />
    </>
  );
}
