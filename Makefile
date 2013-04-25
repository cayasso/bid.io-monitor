REPORTER = spec

test:
	@./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		--bail

docs:
	@./node_modules/.bin/doxx \
		--source public/js/src \
		--target docs
.PHONY: test docs