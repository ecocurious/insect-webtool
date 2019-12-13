# Generated by Django 2.2.8 on 2019-12-13 15:51

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('insects', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Clip',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('frames', models.ManyToManyField(related_name='clips', to='insects.Frame')),
                ('process', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='clips', to='insects.Process')),
            ],
        ),
        migrations.DeleteModel(
            name='Collection',
        ),
    ]