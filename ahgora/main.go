package main

import (
	"ahgora/cmd"

	"github.com/spf13/cobra"
)

func main() {
	rootCmd := &cobra.Command{}
	rootCmd.AddCommand(cmd.Hello())
	rootCmd.AddCommand(cmd.Espelho())
	rootCmd.AddCommand(cmd.Variavel())
	rootCmd.Execute()
}
