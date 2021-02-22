FROM php:8-apache

RUN a2enmod rewrite
COPY ./000-default.conf /etc/apache2/sites-available/000-default.conf
COPY ./php.ini /usr/local/etc/php/php.ini

EXPOSE 80
