## Kubernetes config for redesign prod deployment

### Install nginx
I did not manage to set-up k8s ingress, so we are using standalone nginx

```shell script
sudo apt-get install nginx
sudo apt-get install certbot
sudo apt-get install python-certbot-nginx

git clone https://github.com/cityvizor/cityvizor.git
sudo cp cityvizor/deployment/redesign-prod/nginx/cityvizor.conf /etc/nginx/conf.d/
sudo nginx -s reload

sudo certbot --nginx
```

### Setup microk8s

```shell script
sudo snap install microk8s --classic
microk8s.start

sudo usermod -a -G microk8s ubuntu
alias kubectl='microk8s.kubectl'

cd deployment/redesign-prod/k8s/
kubectl apply -f client-redesign.yml
```

Edit server-strapi-config.yml and set config values
```shell script
kubectl apply -f server-strapi-config.yml
kubectl apply -f server-strapi.yml
```

Edit server-kotlin-config.yml and set config values
```shell script
kubectl apply -f server-kotlin-config.yml
kubectl apply -f server-kotlin.yml
````

Do not forgot to configure Postgres, so it is accessible from EC2
