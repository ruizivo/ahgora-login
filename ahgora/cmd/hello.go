package cmd

import (
	"bufio"
	"fmt"
	"os"

	"net/http"

	"github.com/spf13/cobra"
)

func Hello() *cobra.Command {
	return &cobra.Command{
		Use:   "hello [name]",
		Short: "retorna Olá + name passado",
		Args:  cobra.ExactArgs(1),
		Run: func(cmd *cobra.Command, args []string) {
			fmt.Printf("Olá %s\n", args[0])
		},
	}
}

func Espelho() *cobra.Command {
	var jwt string
	var ano string
	var mes string
	cmd := &cobra.Command{
		Use:   "espelho [jwt]",
		Short: "retorna espelho de ponto",
		Run: func(cmd *cobra.Command, args []string) {
			var url = "https://www.ahgora.com.br/api-espelho/apuracao/" + ano + "-" + mes
			client := &http.Client{}
			req, err := http.NewRequest("GET", url, nil)
			if err != nil {
				//Handle Error
			}
			req.Header = http.Header{
				"cookie": {"qwert-external=" + jwt},
			}
			res, err := client.Do(req)
			if err != nil {
				//Handle Error
			}
			scanner := bufio.NewScanner(res.Body)
			for i := 0; scanner.Scan() && i < 5; i++ {
				fmt.Println(scanner.Text())
			}
		},
	}
	cmd.Flags().StringVarP(&jwt, "jwt", "j", "", "jwt token")
	cmd.Flags().StringVarP(&ano, "ano", "a", "", "parametro ano")
	cmd.Flags().StringVarP(&mes, "mes", "m", "", "parametro mes")
	return cmd
}

func Variavel() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "variavel [name]",
		Short: "retorna as variaveis de ambiente do sistema",
		Run: func(cmd *cobra.Command, args []string) {
			os.Setenv("FOO", "1")
			fmt.Println(os.Environ())
		},
	}
	return cmd
}
