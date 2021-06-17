This is a slight improvement over https://github.com/TotallyInformation/node-red-contrib-uibuilder/wiki/Example:-ReactJS .

# clone example and install dependencies

```bash
# assuming 
cd ~/.node-red/uibuilder
git clone https://github.com/gaillarddamien/uibuilder-react-example.git
cd uibuilder-react-example
npm install
```

# production build

```bash
npm run build
```

It has been built under `~/.node-red/uibuilder/uibuilder-react-example/dist` (see `.env`). It is no longer needed to
copy or symlink stuff.

You can now open http://localhost:1880/uibuilder-react-example

# development server

```bash
npm run start
```

Open http://localhost:3000/uibuilder-react-example

Note this works because `package.json:proxy` resolves to the node-red instance (by default http://localhost:1880).
