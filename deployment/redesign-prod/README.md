## Kubernetes config for redesign prod deployment


### Setup microk8s

```shell script
sudo snap install microk8s --channel=1.18/beta --classic
microk8s.start

sudo usermod -a -G microk8s ubuntu
sudo microk8s.enable dns helm ingress

alias kubectl='microk8s.kubectl'
alias helm='microk8s.helm'

helm init
```

### Setup TLS
https://www.digitalocean.com/community/tutorials/how-to-set-up-an-nginx-ingress-on-digitalocean-kubernetes-using-helm

```shell script
kubectl apply -f https://raw.githubusercontent.com/jetstack/cert-manager/release-0.11/deploy/manifests/00-crds.yaml
kubectl create namespace cert-manager
helm repo add jetstack https://charts.jetstack.io
helm install --name cert-manager --version v0.11.0 --namespace cert-manager jetstack/cert-manager
```

### Run Helm
```shell script

cd deployment/redesign-prod/helm
helm install ./cityvizor \
  --set server_strapi.database_host=cityvizor.chpsyfbvypjs.eu-central-1.rds.amazonaws.com \
  --set server_strapi.database_username=strapi_test \
  --set server_strapi.database_name=strapi_test \
  --set server_strapi.database_password='str@pi_t3st' \
  --set server_kotlin.jdbc_url=jdbc:postgresql://cityvizor.chpsyfbvypjs.eu-central-1.rds.amazonaws.com/cityvizor_test \
  --set server_kotlin.db_pass='cityv!zor_t3st' \
  --set server_kotlin.google_secrets_path=/home/ubuntu/cityvizor/server-kotlin/src/test/resources/city_request/test-credentials.json \
  --set ingress.main_host=cityvizor.ceskodigital.net \
  --set ingress.strapi_host=cityvizor-api.ceskodigital.net 
```

### Create Postgres schema

```sql
CREATE USER cityvizor_test WITH PASSWORD 'cityv!zor_t3st';
create database cityvizor_test;
grant all privileges on database cityvizor_test to cityvizor_test;
```

Do not forgot to configure Postgres, so it is accessible from EC2
