package main

import (
	"fmt"
	"io"
	"os"
	"path"
	"strings"

	"github.com/cucumber/gherkin-go/v13"
)

func main() {

	for i := range os.Args[1:] {
		filePath := os.Args[i+1]
		file, err := os.Open(filePath)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error: %s\n", err)
			os.Exit(1)
			return
		}
		fileDir := path.Dir(filePath)
		err = GenerateTokens(file, fileDir, os.Stdout)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error: %s\n", err)
			os.Exit(1)
			return
		}

		defer file.Close()
	}
}

type tokenGenerator struct {
	out io.Writer
}

func FormatToken(token *gherkin.Token) string {
	if token.IsEOF() {
		return "EOF"
	}
	var items []string
	for i := range token.Items {
		items = append(items, token.Items[i].String())
	}
	return fmt.Sprintf("(%d:%d)%s:%s/%s/%s",
		token.Location.Line,
		token.Location.Column,
		token.Type.Name(),
		token.Keyword,
		token.Text,
		strings.Join(items, ","),
	)
}

func (t *tokenGenerator) Build(tok *gherkin.Token) (bool, error) {
	fmt.Fprintln(t.out, FormatToken(tok))
	return true, nil
}
func (t *tokenGenerator) StartRule(r gherkin.RuleType) (bool, error) {
	return true, nil
}
func (t *tokenGenerator) EndRule(r gherkin.RuleType) (bool, error) {
	return true, nil
}
func (t *tokenGenerator) Reset() {
}

func GenerateTokens(in io.Reader, fileDir string, out io.Writer) error {

	builder := &tokenGenerator{out}
	parser := gherkin.NewParser(builder)
	parser.StopAtFirstError(true)
	matcher := gherkin.NewMatcher(gherkin.GherkinDialectsBuildin())

	scanner := gherkin.NewScanner(in, fileDir)

	return parser.Parse(scanner, matcher)
}
