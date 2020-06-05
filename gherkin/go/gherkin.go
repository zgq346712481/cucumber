package gherkin

import (
	"bufio"
	"fmt"
	"io"
	"io/ioutil"
	"path"
	"regexp"
	"strings"

	"github.com/cucumber/messages-go/v12"
)

type Parser interface {
	StopAtFirstError(b bool)
	Parse(s Scanner, m Matcher) (err error)
}

/*
The Scanner reads a gherkin doc (typically read from a .feature file) and creates a token for
each line. The tokens are passed to the parser, which outputs an AST (Abstract Syntax Tree).

If the scanner sees a # language header, it will reconfigure itself dynamically to look for
Gherkin keywords for the associated language. The keywords are defined in gherkin-languages.json.
*/
type Scanner interface {
	Scan() (line *Line, atEof bool, err error)
}

type Builder interface {
	Build(*Token) (bool, error)
	StartRule(RuleType) (bool, error)
	EndRule(RuleType) (bool, error)
	Reset()
}

type Token struct {
	Type           TokenType
	Keyword        string
	Text           string
	Items          []*LineSpan
	GherkinDialect string
	Indent         string
	Location       *Location
}

func (t *Token) IsEOF() bool {
	return t.Type == TokenTypeEOF
}
func (t *Token) String() string {
	return fmt.Sprintf("%v: %s/%s", t.Type, t.Keyword, t.Text)
}

type LineSpan struct {
	Column int
	Text   string
}

func (l *LineSpan) String() string {
	return fmt.Sprintf("%d:%s", l.Column, l.Text)
}

type parser struct {
	builder          Builder
	stopAtFirstError bool
}

func NewParser(b Builder) Parser {
	return &parser{
		builder: b,
	}
}

func (p *parser) StopAtFirstError(b bool) {
	p.stopAtFirstError = b
}

func NewScanner(r io.Reader, fileDir string) Scanner {
	return &scanner{
		s:       bufio.NewScanner(r),
		fileDir: fileDir,
		line:    0,
	}
}

type scanner struct {
	s             *bufio.Scanner
	line          int
	includedLines []string
	fileDir       string
}

func (t *scanner) Scan() (line *Line, atEof bool, err error) {
	if len(t.includedLines) > 0 {
		firstLine := t.includedLines[0]
		line = &Line{firstLine, t.line, strings.TrimLeft(firstLine, " \t"), atEof}
		t.includedLines = t.includedLines[1:]

		return
	}

	scanning := t.s.Scan()
	if !scanning {
		err = t.s.Err()
		if err == nil {
			atEof = true
		}
	}

	if err == nil {
		t.line++
		str := t.s.Text()
		re := regexp.MustCompile("\\s*#include\\s+(.*)")
		matches := re.FindStringSubmatch(str)
		if len(matches) == 0 {
			line = &Line{str, t.line, strings.TrimLeft(str, " \t"), atEof}
		} else {
			filename := path.Join(t.fileDir, matches[1])
			data, err := ioutil.ReadFile(filename)
			if err != nil {
				return nil, false, err
			}
			body := string(data)
			t.includedLines = strings.Split(body, "\n")

			return nil, false, nil
		}
	}
	return
}

type Line struct {
	LineText        string
	LineNumber      int
	TrimmedLineText string
	AtEof           bool
}

func (g *Line) Indent() int {
	return len(g.LineText) - len(g.TrimmedLineText)
}

func (g *Line) IsEmpty() bool {
	return len(g.TrimmedLineText) == 0
}

func (g *Line) IsEof() bool {
	return g.AtEof
}

func (g *Line) StartsWith(prefix string) bool {
	return strings.HasPrefix(g.TrimmedLineText, prefix)
}

func ParseGherkinDocument(in io.Reader, fileDir string, newId func() string) (gherkinDocument *messages.GherkinDocument, err error) {
	return ParseGherkinDocumentForLanguage(in, fileDir, DEFAULT_DIALECT, newId)
}

func ParseGherkinDocumentForLanguage(in io.Reader, fileDir string, language string, newId func() string) (gherkinDocument *messages.GherkinDocument, err error) {

	builder := NewAstBuilder(newId)
	parser := NewParser(builder)
	parser.StopAtFirstError(false)
	matcher := NewLanguageMatcher(GherkinDialectsBuildin(), language)

	scanner := NewScanner(in, fileDir)

	err = parser.Parse(scanner, matcher)

	return builder.GetGherkinDocument(), err
}
