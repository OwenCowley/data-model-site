# Marketing site (design prototype)

Static landing page for the Data Model workspace, styled with Tailwind CSS 3.4.
Companion to the data-model repository (the app lives there).

```sh
git clone <this repo> && cd data-model-site
npm install
npm run build      # writes public/styles.css
npm run dev        # rebuilds on change
python3 -m http.server -d public 8080
```

Copy reflects the current prototype: offline engines and synthetic fixtures only;
no live connector, hosted service or licence is claimed. Pricing is the
experiment in the data-model docs (DELIVERY.md), not a quote.
