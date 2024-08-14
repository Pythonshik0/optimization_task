from django.contrib import admin
from .models import Profile
from .forms import CustomUserCreationForm, CustomUserChangeForm
from .models import CustomUser, Profile, Task, Message, UpdateFileinMessage
from django.contrib.auth.admin import UserAdmin

admin.site.register(Profile)


class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = CustomUser
    list_display = ('email', 'is_staff', 'is_active',)
    list_filter = ('email', 'is_staff', 'is_active',)
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Permissions', {'fields': ('is_staff', 'is_active')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'lastname', 'middlename', 'login', 'password1', 'password2', 'is_staff', 'is_active')}
        ),
    )
    search_fields = ('email',)
    ordering = ('email',)


admin.site.register(CustomUser, CustomUserAdmin)


@admin.register(Task)
class ProductAdmin(admin.ModelAdmin):
    pass


@admin.register(Message)
class ProductAdmin(admin.ModelAdmin):
    pass


@admin.register(UpdateFileinMessage)
class ProductAdmin(admin.ModelAdmin):
    pass