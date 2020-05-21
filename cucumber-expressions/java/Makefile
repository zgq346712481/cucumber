include default.mk

src/main/java/io/cucumber/cucumberexpressions/CucumberExpressionParser.java: CucumberExpressionGrammar.berp Java.razor
	mono /var/lib/berp/1.1.1/tools/net471/Berp.exe -g CucumberExpressionGrammar.berp -t Java.razor -o $@
	# Remove BOM
	awk 'NR==1{sub(/^\xef\xbb\xbf/,"")}{print}' < $@ > $@.nobom
	mv $@.nobom $@
