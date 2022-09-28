GOOS=windows GOARCH=386 go build -o bin/ahgora-386.exe main.go
GOOS=darwin GOARCH=amd64 go build -o bin/ahgora-amd64.exe main.go
GOOS=linux GOARCH=arm go build -o bin/ahgora.app main.go
