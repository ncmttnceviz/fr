const house = {
  title: "Yenibatı da lüks teraslı 2+1 daire",
  description:
    "Yüksek giriş, sıfır bina, cam balkonuna kadar full yapılı. Konumu poyraz sokakta.",
  location: "Ankara,Batıkent, Yenibatı",
  space: 120,
};

export default function () {
  const houses: any[] = [];
  const images = ["01.jpg", "none.jpg", "02.jpg", "03.jpg"];
  for (let i = 0; i < 6; i++) {
    const jpg = images[Math.floor(Math.random() * images.length)];
    const isRent = Math.random() < 0.5;
    const price = isRent
      ? 1000 + Math.ceil(Math.random() * 3000)
      : 250000 + Math.ceil(Math.random() * 300000);
    const commision = isRent
      ? 200 + Math.ceil(price * 0.8 * Math.random())
      : Math.ceil(Math.random() * 10);
    houses.push({
      ...house,
      isRent,
      commision,
      price,
      image: "/mock/houses/" + jpg,
    });
  }

  return houses;
}
