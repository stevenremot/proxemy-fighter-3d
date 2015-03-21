install:
	npm install
	./node_modules/.bin/jspm install

serve:
	./node_modules/.bin/http-server -c0

bundle:
	./node_modules/.bin/jspm bundle src/main --inject
