
from django import forms

from .models import Post,Comment
from django.core.exceptions import ValidationError


class PostForm(forms.ModelForm):
    title = forms.CharField(strip=False)
    text = forms.CharField(strip=False)

    class Meta:
        model = Post
        fields = ('title', 'text','category','tags','image','thumbnail_image','is_private')
       
        widgets = {
            "title": forms.TextInput(attrs={"class": "form-control"}),
            "text": forms.Textarea(attrs={"class": "form-control"}),
            "category": forms.Select(attrs={"class": "form-control"}),
            "tags": forms.SelectMultiple(attrs={"class": "form-control"}),
            "image": forms.ClearableFileInput(attrs={"class": "form-control"}),
            "thumbnail_image": forms.ClearableFileInput(attrs={"class": "form-control"}),
            "is_private": forms.CheckboxInput(attrs={"class": "form-check-input"}),
        }

    def clean_title(self):
        title=self.cleaned_data['title']
        print(title)

        if title and title.strip() == "":
            raise ValidationError('title field cant contain whitesapce')
        return title
    
    def clean_text(self):
        text=self.cleaned_data['text']
        print(text)

        if text and text.strip() == "":
            raise ValidationError('text field cant contain only whitesapce')
        return text

            
   

