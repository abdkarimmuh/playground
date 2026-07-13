// Command yaegi-runner interprets a single Go source file passed as the
// first CLI argument and executes it via yaegi (github.com/traefik/yaegi).
// It is compiled to a WASI Preview 1 module (GOOS=wasip1 GOARCH=wasm) and
// run fresh, once per Run click, from the browser — see
// lib/playground/sandbox/go.ts.
package main

import (
	"fmt"
	"os"

	"github.com/traefik/yaegi/interp"
	"github.com/traefik/yaegi/stdlib"
)

func main() {
	// Defensive: yaegi already recovers panics raised by interpreted user
	// code internally (verified empirically), but guard the host process
	// too in case that ever changes across yaegi versions.
	defer func() {
		if r := recover(); r != nil {
			fmt.Fprintln(os.Stderr, "yaegi-runner: panic:", r)
		}
	}()

	if len(os.Args) < 2 {
		fmt.Fprintln(os.Stderr, "yaegi-runner: no source provided")
		return
	}

	i := interp.New(interp.Options{Stdout: os.Stdout, Stderr: os.Stderr})

	if err := i.Use(stdlib.Symbols); err != nil {
		fmt.Fprintln(os.Stderr, "yaegi-runner: failed to load stdlib:", err)
		return
	}

	if _, err := i.Eval(os.Args[1]); err != nil {
		fmt.Fprintln(os.Stderr, err)
	}
}
