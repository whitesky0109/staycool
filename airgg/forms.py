from django import forms
from airgg.models import Users

class PostForm(forms.ModelForm):

	class Meta:
		model = Users
		fields = ('user_id', 'preference_line' ,'member', 'position')
