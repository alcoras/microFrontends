@ECHO OFF
set DOTNET_ENVIRONMENT=Development
set ASPNETCORE_ENVIRONMENT=Development
cd C:\Users\MTX\source\repos\AcS\EventBroker\bin\Release\netcoreapp3.0
start EventBroker.exe
cd C:\Users\MTX\source\repos\AcS\APIGateway\bin\Release\netcoreapp3.0
start APIGateway.exe
cd C:\Users\MTX\source\repos\AcS\Occupations\bin\Release\netcoreapp3.0
start Occupations.exe
cd C:\Users\MTX\source\repos\AcS\PersonData\bin\Release\netcoreapp3.0
start PersonData.exe
