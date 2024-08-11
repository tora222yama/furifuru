# use PHP official image
FROM php:8.3.3-apache-bullseye

# install pecl extensions
RUN apt-get update \
 && apt-get install -y libzip-dev unzip \
 && docker-php-ext-install zip pdo mysqli pdo_mysql \
 && docker-php-ext-install opcache \
 && yes '' | pecl install redis

# install composer
RUN curl https://getcomposer.org/download/2.7.1/composer.phar -o /usr/local/bin/composer -s \
 && chmod 755 /usr/local/bin/composer

# install node.js
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash -\
 && apt-get install -y nodejs

# install git for local
RUN apt-get update && \
    apt-get install -y git
RUN git config --global --add safe.directory /var/www/html

# set configuration for apache and php
COPY apache-virtualhost.conf /etc/apache2/sites-enabled/000-default.conf
COPY php.ini /usr/local/etc/php/php.ini
COPY server.sh /usr/local/bin/server.sh
COPY ../../../wportal2-app/ /var/www/html/wportal2-app/
RUN chmod 755 /usr/local/bin/server.sh
RUN ln -s /etc/apache2/mods-available/rewrite.load /etc/apache2/mods-enabled/rewrite.load

# set entrypoint
# ENTRYPOINT ["/usr/local/bin/server.sh"]
