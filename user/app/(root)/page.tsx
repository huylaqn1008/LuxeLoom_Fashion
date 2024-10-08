import Collections from "@/components/Collections"
import ProductList from "@/components/ProductList"
import Image from "next/image"

export default function Home() {
  return (
    <>
      <Image
        src='/banner.png'
        alt="banner"
        width={1500}
        height={200}
        className="block mx-auto"
      />

      <Collections />
      <ProductList />
    </>
  )
}
