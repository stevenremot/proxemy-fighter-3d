.PHONY: install serve bundle prod-bundle clean

install:
	npm install

serve:
	npx parcel serve index.html

bundle:
	npx parcel build index.html assets

prod-bundle: bundle

clean:
	rm -rf dist
