import {
  US_NATURE_STOP_MEDIA,
  type NatureStopMedia,
} from "./us-nature-stop-media";

export const KYOTO_NATURE_STOP_MEDIA: Record<string, NatureStopMedia> = {
  "kyoto-nature-arashiyama-bamboo": {
    photo: "https://media.rguide.co/venues/jp/kyoto/arashiyama-bamboo-grove/kyoto-nature-arashiyama-bamboo-primary.jpg",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Arashiyama_Bamboo_Grove_(Unsplash).jpg",
  },
  "kyoto-nature-okochi-sanso": {
    photo: "https://media.rguide.co/venues/jp/kyoto/okochi-sanso-garden/kyoto-nature-okochi-sanso-primary.jpg",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:%C5%8Ck%C5%8Dchi_Sans%C5%8D_garden,_Kyoto;_September_2014_(04).jpg",
  },
  "kyoto-nature-philosophers-path": {
    photo: "https://media.rguide.co/venues/jp/kyoto/philosopher-s-path/kyoto-nature-philosophers-path-primary.jpg",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Tetsugaku_no_Michi_01.JPG",
  },
  "kyoto-nature-botanical": {
    photo: "https://media.rguide.co/venues/jp/kyoto/kyoto-botanical-gardens/kyoto-nature-botanical-primary.jpg",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:KyotoBotanicalGarden.jpg",
  },
  "kyoto-nature-daimonji": {
    photo: "https://media.rguide.co/venues/jp/kyoto/mount-daimonji/kyoto-nature-daimonji-primary.jpg",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Kyoto_view_from_Mt.Daimonji.jpg",
  },
  "kyoto-nature-kurama-kibune": {
    photo: "https://media.rguide.co/venues/jp/kyoto/kurama-to-kibune-trail/kyoto-nature-kurama-kibune-primary.jpg",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Bridge_over_a_stream_at_Kurama-dera_(48885033518).jpg",
  },
  "kyoto-nature-monkey-park": {
    photo: "https://media.rguide.co/venues/jp/kyoto/arashiyama-monkey-park-iwatayama/kyoto-nature-monkey-park-primary.jpg",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Iwatayama_Monkey_Park.jpg",
  },
  "kyoto-nature-maruyama": {
    photo: "https://media.rguide.co/venues/jp/kyoto/maruyama-park/kyoto-nature-maruyama-primary.jpg",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Maruyama_Park_@_Kyoto_(13310607463).jpg",
  },
  "kyoto-nature-shoseien": {
    photo: "https://media.rguide.co/venues/jp/kyoto/shosei-en-garden/kyoto-nature-shoseien-primary.jpg",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Sh%C5%8Dsei-en_(Shimogyo_Kyoto)_hdsrGarden_S5_42.jpg",
  },
  "kyoto-nature-hozu-river": {
    photo: "https://media.rguide.co/venues/jp/kyoto/hozu-river-gorge/kyoto-nature-hozu-river-primary.jpg",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Hozukyo_(6364410167).jpg",
  },
};

export const NATURE_STOP_MEDIA: Record<string, NatureStopMedia> = {
  ...US_NATURE_STOP_MEDIA,
  ...KYOTO_NATURE_STOP_MEDIA,
};
