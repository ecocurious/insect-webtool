# Generated by Django 2.2.8 on 2019-12-08 18:14

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Appearance',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('timestamp', models.TimeField()),
                ('url', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='Classification',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('appearances', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='classifications', to='insects.Appearance')),
            ],
        ),
        migrations.CreateModel(
            name='Process',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField()),
                ('kind', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='Tracking',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('process', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tracking', to='insects.Process')),
            ],
        ),
        migrations.CreateModel(
            name='Species',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('process', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='species', to='insects.Process')),
            ],
        ),
        migrations.CreateModel(
            name='Frame',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('timestamp', models.TimeField()),
                ('url', models.TextField()),
                ('process', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='frames', to='insects.Process')),
            ],
        ),
        migrations.CreateModel(
            name='Collection',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('frames', models.ManyToManyField(related_name='collections', to='insects.Frame')),
                ('process', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='collections', to='insects.Process')),
            ],
        ),
        migrations.CreateModel(
            name='ClassificationValue',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('value', models.FloatField()),
                ('is_maximum', models.BooleanField()),
                ('classification', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='values', to='insects.Classification')),
                ('species', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='classification_values', to='insects.Species')),
            ],
        ),
        migrations.AddField(
            model_name='classification',
            name='process',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='classifications', to='insects.Process'),
        ),
        migrations.AddField(
            model_name='classification',
            name='tracking',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='classifications', to='insects.Tracking'),
        ),
        migrations.CreateModel(
            name='BoundingBox',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('x', models.IntegerField()),
                ('y', models.IntegerField()),
                ('width', models.IntegerField()),
                ('height', models.IntegerField()),
                ('process', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='boundingboxes', to='insects.Process')),
            ],
        ),
        migrations.AddField(
            model_name='appearance',
            name='boundingbox',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='appearances', to='insects.BoundingBox'),
        ),
        migrations.AddField(
            model_name='appearance',
            name='frame',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='appearances', to='insects.Frame'),
        ),
        migrations.AddField(
            model_name='appearance',
            name='process',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='appearances', to='insects.Process'),
        ),
        migrations.AddField(
            model_name='appearance',
            name='tracking',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='appearances', to='insects.Tracking'),
        ),
    ]
